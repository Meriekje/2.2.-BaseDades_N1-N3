package virtualpets.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import virtualpets.config.TestSecurityConfig;
import virtualpets.dtos.PetCreateDTO;
import virtualpets.dtos.PetDTO;
import virtualpets.models.Pet;
import virtualpets.models.PetType;
import virtualpets.models.Role;
import virtualpets.models.User;
import virtualpets.services.PetService;
import virtualpets.services.UserService;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PetController.class)
@Import(TestSecurityConfig.class)
@ActiveProfiles("test")
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private Pet testPet;
    private PetCreateDTO petCreateDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setRole(Role.ROLE_USER);

        testPet = new Pet();
        testPet.setId(1L);
        testPet.setName("Fluffy");
        testPet.setType(PetType.MAGPIE);
        testPet.setColor("#FF6B6B");
        testPet.setHappinessLevel(50);
        testPet.setEnergyLevel(50);
        testPet.setHungerLevel(50);
        testPet.setOwner(testUser);

        petCreateDTO = new PetCreateDTO();
        petCreateDTO.setName("Fluffy");
        petCreateDTO.setType(PetType.MAGPIE);
        petCreateDTO.setColor("#FF6B6B");
    }

    @Test
    void getUserPets_Success() throws Exception {
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(petService.findByOwnerId(1L)).thenReturn(Arrays.asList(testPet));

        mockMvc.perform(get("/api/pets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Fluffy"));
    }

    @Test
    void getPetById_Success() throws Exception {
        when(petService.findById(1L)).thenReturn(Optional.of(testPet));

        mockMvc.perform(get("/api/pets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpected(jsonPath("$.name").value("Fluffy"));
    }

    @Test
    void getPetById_NotFound() throws Exception {
        when(petService.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/pets/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createPet_Success() throws Exception {
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(petService.createPet(any(Pet.class), eq(1L))).thenReturn(testPet);

        mockMvc.perform(post("/api/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(petCreateDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Fluffy"));
    }

    @Test
    void feedPet_Success() throws Exception {
        when(petService.findById(1L)).thenReturn(Optional.of(testPet));
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(petService.updatePetDirect(any(Pet.class))).thenReturn(testPet);

        mockMvc.perform(post("/api/pets/1/feed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void deletePet_Success() throws Exception {
        when(petService.findById(1L)).thenReturn(Optional.of(testPet));
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        mockMvc.perform(delete("/api/pets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Pet deleted successfully"));
    }
}
